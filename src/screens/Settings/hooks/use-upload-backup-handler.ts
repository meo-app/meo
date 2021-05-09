import * as FileSystem from "expo-file-system";
import DocumentPicker from "react-native-document-picker";
import { useMutation } from "react-query";
import { useDB } from "../../../providers/SQLiteProvider";
import { Post } from "../../../shared/SQLiteEntities";
import { useCreatePost } from "../../../hooks/use-create-post";

interface Result {
  skipped: string[];
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

function useUploadBackupHandler() {
  const db = useDB();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: pickDocument } = usePickDocumentMutation();

  return useMutation<Result, string>(async () => {
    const posts = await pickDocument();
    const result: Result = {
      skipped: [],
      inserted: 0,
    };
    for (const post of posts) {
      /**
       * If the post has been inserted in the past / or if there is a post with the
       * exact same content we are going to skip it
       */
      const hasBeenInserted = await new Promise((resolve, reject) =>
        db.transaction(
          (tx) =>
            tx.executeSql(
              `select id from posts where value = "${post.value}" collate nocase`,
              [],
              (_, { rows }) => resolve(Boolean(rows.length))
            ),
          (err) => {
            console.log("Error!", { err });
            reject(err);
          }
        )
      );

      if (hasBeenInserted) {
        result.skipped.push(post.value);
        continue;
      }

      /**
       * createPost handles hashtags
       * */
      await createPost({ text: post.value, timestamp: post.timestamp });
      result.inserted++;
    }

    return result;
  });
}

export { useUploadBackupHandler };
