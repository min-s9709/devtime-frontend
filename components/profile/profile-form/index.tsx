"use client";

import type { TechStackItem } from "@/components/common/auto-complete";
import AutoComplete from "@/components/common/auto-complete";
import Chip from "@/components/common/chip";
import InputField from "@/components/common/input-field";
import SelectDropdown from "@/components/common/select-dropdown";
import ImageUpload from "@/components/profile/image-upload";
import ProfileFormFooter from "@/components/profile/profile-form/profile-form-footer";
import {
  CUSTOM_PURPOSE,
  SELECT_CAREER_OPTIONS,
  SELECT_PURPOSE_OPTIONS,
} from "@/constants";
import { useCreateProfile } from "@/hooks/queries/use-create-profile";
import { useUploadImage } from "@/hooks/queries/use-upload-image";
import { ProfileFormData, profileSchema } from "@/schemas/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

export default function ProfileForm() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      career: "",
      purpose: "",
      customPurpose: "",
      goal: "",
      techStacks: [],
      profileImage: null,
    },
  });
  const purpose = useWatch({ control, name: "purpose" });
  const techStacks = useWatch({ control, name: "techStacks" });
  const { uploadImage, isUploading } = useUploadImage();
  const { createProfile, isPending } = useCreateProfile();

  const onSubmit = handleSubmit(async (data) => {
    // 이미지가 있을 때만 presigned URL로 업로드하고, 저장용 key를 받아온다.
    const profileImage = data.profileImage
      ? await uploadImage(data.profileImage)
      : "";

    await createProfile({
      career: data.career,
      purpose:
        data.purpose === CUSTOM_PURPOSE ? data.customPurpose : data.purpose,
      goal: data.goal,
      techStacks: data.techStacks.map((item) => item.name),
      profileImage,
    });
  });

  const handleSelect = (item: TechStackItem) => {
    const current = getValues("techStacks");
    if (current.some((v) => v.id === item.id || v.name === item.name)) return;
    setValue("techStacks", [...current, item]);
  };

  const handleDelete = (id: number) => {
    const current = getValues("techStacks");
    setValue(
      "techStacks",
      current.filter((item) => item.id !== id),
    );
  };

  return (
    <form
      className="w-105 flex flex-col justify-center gap-9"
      onSubmit={onSubmit}
    >
      <span className="text-heading font-bold text-primary text-center">
        프로필 설정
      </span>

      <div className="flex flex-col gap-10">
        <Controller
          name="career"
          control={control}
          render={({ field }) => (
            <SelectDropdown
              placeholder="개발 경력을 선택해 주세요."
              label="개발 경력"
              options={SELECT_CAREER_OPTIONS}
              selectedValue={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <section className="flex flex-col gap-2">
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                placeholder="공부 목적"
                label="공부 목적"
                options={SELECT_PURPOSE_OPTIONS}
                selectedValue={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {purpose === CUSTOM_PURPOSE && (
            <InputField
              placeholder="공부 목적을 입력해 주세요."
              {...register("customPurpose")}
            />
          )}
        </section>

        <InputField
          {...register("goal")}
          label="공부 목표"
          placeholder="공부 목표를 입력해주세요."
        />

        <section className="flex flex-col gap-2">
          <AutoComplete
            label="공부/사용 중인 기술 스택"
            placeholder="기술 스택을 검색해 등록해 주세요."
            onSelect={handleSelect}
          />
          {techStacks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStacks.map((item) => (
                <Chip
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
        <Controller
          name="profileImage"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
        <ProfileFormFooter disabled={!isValid || isUploading || isPending} />
      </div>
    </form>
  );
}
