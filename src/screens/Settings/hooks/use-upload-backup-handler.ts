import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { useMutation, UseMutationOptions } from "react-query";
import { useCreatePost } from "../../../hooks/use-create-post";
import { useDB } from "../../../providers/SQLiteProvider";
import { Post } from "../../../shared/SQLiteEntities";

/**
 * TODO: versioning of backups
 */

function usePickDocumentMutation() {
  return useMutation(async () => {
    const documentPickerResponse = await DocumentPicker.pick({
      // @ts-ignore: Types doesnt match
      type: DocumentPicker.types.allFiles,
      mode: "open",
    });

    let result = "";
    if (Platform.OS === "ios") {
      result = await FileSystem.readAsStringAsync(
        documentPickerResponse.fileCopyUri,
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
    } else if (Platform.OS === "android") {
      const uri = `${FileSystem.documentDirectory}/meo.temp.text`;
      await FileSystem.copyAsync({
        from: documentPickerResponse.fileCopyUri,
        to: uri,
      });
      result = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    return JSON.parse(result) as Pick<Post, "timestamp" | "value">[];
  });
}

function useUploadBackupHandler(options?: UseMutationOptions<void, string>) {
  const db = useDB();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: pickDocument } = usePickDocumentMutation();

  return useMutation<void, string>(async () => {
    const backup = await pickDocument();
    const posts = await new Promise<Post[]>((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql("select * from posts", [], (_, { rows }) => {
            resolve(
              [...Array(rows.length).keys()].map((index) => rows.item(index))
            );
          });
        },
        (err) => {
          console.error(
            "useUploadBackupHandler: error while fetching all posts"
          );
          reject(err);
        }
      );
    });

    const hash: Record<string, boolean> = posts.reduce(
      (acc, next) => ({
        ...acc,
        [next.value]: true,
      }),
      {}
    );

    await Promise.all([
      backup.map((post) => {
        if (!hash[post.value]) {
          return createPost({ text: post.value, timestamp: post.timestamp });
        }
      }),
    ]);
  }, options);
}

export { useUploadBackupHandler };
