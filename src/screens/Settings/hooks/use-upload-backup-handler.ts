import * as FileSystem from "expo-file-system";
import DocumentPicker from "react-native-document-picker";
import { useMutation, UseMutationOptions } from "react-query";
import { useCreatePost } from "../../../hooks/use-create-post";
import { useDB } from "../../../providers/SQLiteProvider";
import { Post } from "../../../shared/SQLiteEntities";

interface Result {
  skipped: number;
  inserted: number;
}

function usePickDocumentMutation() {
  return useMutation(async () => {
    const documentPickerResponse = await DocumentPicker.pick({
      // @ts-ignore: Types doesnt match
      type: DocumentPicker.types.allFiles,
      mode: "open",
    });

    const result = await FileSystem.readAsStringAsync(
      documentPickerResponse.fileCopyUri,
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    return JSON.parse(result) as Pick<Post, "timestamp" | "value">[];
  });
}

function useUploadBackupHandler(options?: UseMutationOptions<Result, string>) {
  const db = useDB();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: pickDocument } = usePickDocumentMutation();

  return useMutation<Result, string>(async () => {
    const backup = await pickDocument();
    const result: Result = {
      skipped: 0,
      inserted: 0,
    };

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

    return result;
  }, options);
}

export { useUploadBackupHandler };
