import * as FileSystem from "expo-file-system";
import Share from "react-native-share";
import { useMutation } from "react-query";
import { useDB } from "../../../providers/SQLiteProvider";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

// const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
// if (perm.status != "granted") {
//   return;
// }

// try {
//   const asset = await MediaLibrary.createAssetAsync(downloadedFile.uri);
//   const album = await MediaLibrary.getAlbumAsync("Download");
//   if (album == null) {
//     await MediaLibrary.createAlbumAsync("Download", asset, false);
//   } else {
//     await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
//   }
// } catch (e) {
//   handleError(e);
// }

/**
 * TODO:
 *
 * - [ ] support versioning on backup files
 * - [ ] Submission manager on download / upload etc
 * - [ ] Support Android
 */

const FILE_URI = `${FileSystem.documentDirectory}/meo.backup`;

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

    Share.open({
      url: `${FileSystem.documentDirectory}/meo.backup`,
    });
  });
}

export { useDownloadBackupHandler };
