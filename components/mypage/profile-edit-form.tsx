"use client";

import type { TechStackItem } from "@/components/common/auto-complete";
import AutoComplete from "@/components/common/auto-complete";
import Button from "@/components/common/button";
import Chip from "@/components/common/chip";
import HelperText from "@/components/common/helper-text";
import InputField from "@/components/common/input-field";
import AlertModal from "@/components/common/modal/alert-modal";
import ConfirmModal from "@/components/common/modal/confirm-modal";
import SelectDropdown from "@/components/common/select-dropdown";
import ImageUpload from "@/components/profile/image-upload";
import {
  CUSTOM_PURPOSE,
  SELECT_CAREER_OPTIONS,
  SELECT_PURPOSE_OPTIONS,
} from "@/constants";
import { useCheckDuplicate } from "@/hooks/queries/use-check-duplicate";
import { useProfile } from "@/hooks/queries/use-profile";
import { useUpdateProfile } from "@/hooks/queries/use-update-profile";
import { useUploadImage } from "@/hooks/queries/use-upload-image";
import {
  createEditProfileSchema,
  EditProfileFormData,
} from "@/schemas/profile";
import { useModalStore } from "@/store/use-modal-store";
import type { Profile } from "@/types/response";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, useEffect, useMemo } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  buildProfilePayload,
  toEditDefaultValues,
} from "./profile-edit-form.model";

interface ProfileEditFormProps {
  onDone: () => void;
}

// 조회와 동일한 캐시(useProfile)에서 기존 값을 읽어 폼을 프리필한다.
export default function ProfileEditForm({ onDone }: ProfileEditFormProps) {
  const { profile, isPending, isError } = useProfile();

  if (isPending) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        프로필을 불러오는 중...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-body text-gray-500">
        프로필을 불러오지 못했어요.
      </div>
    );
  }

  return <EditForm profile={profile} onDone={onDone} />;
}

// 닉네임 입력 + 중복 확인. 수정 화면에선 닉네임을 바꿨을 때만 확인이 필요하므로,
// 기존 닉네임과 같으면 확인 버튼을 비활성화한다.
function NicknameField({ originalNickname }: { originalNickname: string }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EditProfileFormData>();

  const nickname = watch("nickname");
  const isUnchanged = nickname === originalNickname;
  const canCheck = !!nickname && !errors.nickname && !isUnchanged;

  const {
    checkDuplicate,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    variables,
  } = useCheckDuplicate();

  // 마지막으로 검사한 값과 현재 입력이 다르면 이전 결과는 무효 처리한다.
  const isResultStale = variables?.value !== nickname;

  const handleCheck = () => {
    checkDuplicate(
      { type: "nickname", value: nickname },
      {
        onSuccess: (res) => {
          if (res.available)
            setValue("nicknameChecked", nickname, { shouldValidate: true });
        },
      },
    );
  };

  const getHelper = () => {
    if (errors.nickname)
      return {
        status: "error" as const,
        message: errors.nickname.message as string,
      };
    if (!isResultStale && isError)
      return { status: "error" as const, message: error.message };
    if (!isResultStale && isSuccess && data)
      return {
        status: data.available ? ("success" as const) : ("error" as const),
        message: data.message,
      };
    return null;
  };

  const helper = getHelper();

  return (
    <section className="flex flex-col gap-2">
      <label
        htmlFor="edit-nickname"
        className="text-body-sm font-medium text-gray-600"
      >
        닉네임
      </label>
      <div className="flex gap-2">
        <div className="flex-1">
          <InputField
            id="edit-nickname"
            placeholder="닉네임을 입력해 주세요."
            className={cn(errors.nickname && "border border-negative")}
            {...register("nickname")}
          />
        </div>
        <Button
          variant="Secondary"
          value={isPending ? "확인 중" : "중복 확인"}
          className="h-11 w-21 shrink-0 text-body-sm"
          disabled={!canCheck || isPending}
          onClick={handleCheck}
        />
      </div>
      {helper && <HelperText status={helper.status} message={helper.message} />}
    </section>
  );
}

function EditForm({
  profile,
  onDone,
}: {
  profile: Profile;
  onDone: () => void;
}) {
  const detail = profile.profile;
  // 기존 이미지 URL. 미리보기 표시에만 쓰고, 전송에는 쓰지 않는다.
  // (수정 시엔 새로 업로드한 S3 key만 보내야 하며, GET의 전체 URL을 되보내면 안 됨)
  const existingImage = detail?.profileImage ?? "";
  // 프로필 row가 아직 없는 사용자(초기 설정 건너뛰기). 이때는 PUT이 업서트로 동작하고,
  // career·purpose가 NOT NULL이라 생성에 반드시 필요하므로 화면에도 필수 표시를 노출한다.
  const isNewProfile = !detail;

  const schema = useMemo(
    () => createEditProfileSchema(profile.nickname),
    [profile.nickname],
  );

  const methods = useForm<EditProfileFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    // 서버 프로필 → 폼 초기값 변환은 순수함수로 분리했다.
    defaultValues: toEditDefaultValues(profile),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { isValid, isDirty, errors },
  } = methods;

  // 프리필된 값이 이미 유효하면 저장 버튼이 곧바로 활성화되도록 마운트 시 1회 검증한다.
  useEffect(() => {
    trigger();
  }, [trigger]);

  const purpose = useWatch({ control, name: "purpose" });
  const techStacks = useWatch({ control, name: "techStacks" });
  const { uploadImage, isUploading } = useUploadImage();
  const { updateProfile, isPending } = useUpdateProfile();

  // 실제 저장. 확인 모달에서 '저장하기'를 눌렀을 때만 호출된다.
  const handleSave = async (data: EditProfileFormData) => {
    try {
      // 바뀐 필드만 담은 payload는 순수함수로 계산한다. (부분 업데이트)
      const payload = buildProfilePayload(data, profile);

      // 프로필 이미지는 비동기 업로드라 여기서 채운다. 새 파일을 골랐을 때만 S3 key 전송.
      // (기존 이미지 URL을 되돌려 보내면 안 됨)
      if (data.profileImage) {
        payload.profileImage = await uploadImage(data.profileImage);
      }

      // 바뀐 게 없으면 요청을 보내지 않고 화면만 복귀한다.
      if (Object.keys(payload).length > 0) {
        await updateProfile(payload);
      }

      // 저장 성공 알림. '확인'을 누르면 onDone으로 조회 화면(ProfileView)으로 돌아간다.
      useModalStore.getState().open(
        createElement(AlertModal, {
          title: "변경사항이 저장되었습니다",
          onConfirm: onDone,
        }),
      );
    } catch {
      // 실패 알림은 useUpdateProfile onError에서 처리한다.
    }
  };

  // 저장 버튼(제출)은 검증 통과 시 곧바로 저장하지 않고 확인 모달을 먼저 띄운다.
  const onSubmit = handleSubmit((data) => {
    useModalStore.getState().open(
      createElement(ConfirmModal, {
        description: "변경 사항을 저장하시겠습니까?",
        cancelText: "취소",
        confirmText: "저장하기",
        onConfirm: () => handleSave(data),
      }),
    );
  });

  const handleSelect = (item: TechStackItem) => {
    const current = getValues("techStacks");
    if (current.some((v) => v.id === item.id || v.name === item.name)) return;
    // setValue는 기본적으로 dirty를 갱신하지 않으므로, 저장 버튼(isDirty)이 반영되도록
    // shouldDirty를 명시한다. (기술 스택만 변경한 경우에도 저장 가능하게)
    setValue("techStacks", [...current, item], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDelete = (id: number) => {
    const current = getValues("techStacks");
    setValue(
      "techStacks",
      current.filter((item) => item.id !== id),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const isSubmitting = isUploading || isPending;

  return (
    <FormProvider {...methods}>
      <form className="w-full" onSubmit={onSubmit}>
        <section className="flex w-full flex-col gap-8 rounded-2xl bg-white p-8 shadow-1">
          {/* 프로필 이미지 (기존 이미지 미리보기 + 교체) */}
          <Controller
            name="profileImage"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                initialImageUrl={existingImage || undefined}
              />
            )}
          />

          {/* 2단 그리드: 좌측 회원 정보 / 우측 프로필 정보 */}
          <div className="flex gap-10">
            <div className="flex flex-1 flex-col gap-6">
              <NicknameField originalNickname={profile.nickname} />

              <section className="flex flex-col gap-2">
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      label="공부 목적"
                      required={isNewProfile}
                      placeholder="공부 목적"
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

              <section className="flex flex-col gap-2">
                <InputField
                  label="새 비밀번호"
                  type="password"
                  placeholder="변경할 비밀번호를 입력해 주세요."
                  className={cn(errors.newPassword && "border border-negative")}
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <HelperText
                    status="error"
                    message={errors.newPassword.message as string}
                  />
                )}
              </section>

              <section className="flex flex-col gap-2">
                <InputField
                  label="새 비밀번호 재입력"
                  type="password"
                  placeholder="비밀번호를 다시 입력해 주세요."
                  className={cn(
                    errors.confirmNewPassword && "border border-negative",
                  )}
                  {...register("confirmNewPassword")}
                />
                {errors.confirmNewPassword && (
                  <HelperText
                    status="error"
                    message={errors.confirmNewPassword.message as string}
                  />
                )}
              </section>
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <Controller
                name="career"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    label="개발 경력"
                    required={isNewProfile}
                    placeholder="개발 경력을 선택해 주세요."
                    options={SELECT_CAREER_OPTIONS}
                    selectedValue={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <InputField
                label="공부 목표"
                placeholder="공부 목표를 입력해주세요."
                {...register("goal")}
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
            </div>
          </div>

          {/* 액션 */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="Tertiary"
              value="취소"
              onClick={onDone}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="Primary"
              value="변경 사항 저장하기"
              // 변경된 내용이 없으면(isDirty=false) 저장할 게 없어 비활성화한다.
              disabled={!isValid || !isDirty || isSubmitting}
            />
          </div>
        </section>
      </form>
    </FormProvider>
  );
}
