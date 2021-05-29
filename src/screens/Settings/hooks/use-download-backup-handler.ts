import * as FileSystem from "expo-file-system";
import Share from "react-native-share";
import { useMutation } from "react-query";
import { useDB } from "../../../providers/SQLiteProvider";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";

const FILE_URI = `${FileSystem.documentDirectory}/meo.txt`;

function useDownloadBackupHandler() {
  const db = useDB();
  return useMutation(async () => {
    const posts = await new Promise((resolve, reject) => {
      db.transaction(
        (tx) =>
          tx.executeSql("select * from posts", [], (_, { rows }) => {
            resolve(
              [...Array(rows.length).keys()].map((index) => rows.item(index))
            );
          }),
        (err) => {
          console.error(`Error fetching all posts: \n ${err}`);
          reject(err);
        }
      );
    });

    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(posts), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (Platform.OS === "ios") {
      Share.open({ url: FILE_URI });
      return;
    } else if (Platform.OS === "android") {
      const perm = await MediaLibrary.getPermissionsAsync();
      if (perm.status !== "granted") {
        const req = await MediaLibrary.requestPermissionsAsync();
        if (req.status !== "granted") {
          return;
        }
      }

      try {
        const asset = await MediaLibrary.createAssetAsync(FILE_URI);
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album === null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        Alert.alert("Backup downloaded");
      } catch (e) {
        console.error(e);
      }
    }
  });
}

export { useDownloadBackupHandler };
