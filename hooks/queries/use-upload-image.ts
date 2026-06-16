import { getPresignedUrl, uploadFileToPresignedUrl } from "@/apis/profile";
import { useMutation } from "@tanstack/react-query";

// presigned URL 발급 → 스토리지에 직접 업로드 → 저장용 key 반환
export const useUploadImage = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const { presignedUrl, key } = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
      });
      await uploadFileToPresignedUrl(presignedUrl, file);
      return key;
    },
  });

  return { uploadImage: mutateAsync, isUploading: isPending };
};
