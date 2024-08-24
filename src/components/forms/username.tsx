import { useAuth } from "@clerk/nextjs";
import { Button, Input, Slider, Typography } from "antd";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type FormValues = {
  name: string;
  worded: number;
};

export type UsernameFormType = {
  handleSubmit: UseFormHandleSubmit<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  isUsernamePending: boolean;
  isValid: boolean;
  generateUsername: (data: {
    name: string;
    worded: "ONE" | "TWO";
    userId: string;
    isFav: boolean;
    isCombo: boolean;
    isUsername: boolean;
  }) => void;
};

export default function UsernameForm({
  watch,
  errors,
  isValid,
  setValue,
  register,
  handleSubmit,
  isUsernamePending,
  generateUsername,
}: UsernameFormType) {
  const user = useAuth();

  return (
    <form className="flex flex-col gap-4">
      <div>
        <Typography.Title level={5}>Name</Typography.Title>
        <Input
          type="text"
          placeholder="Please share your full name"
          {...register("name", { required: true, maxLength: 100 })}
          onChange={(e) => setValue("name", e.target.value)}
          status={errors.name && "error"}
        />
      </div>
      <div>
        <Typography.Title level={5}>Justify word</Typography.Title>
        <Slider
          min={1}
          max={2}
          defaultValue={1}
          value={watch("worded")}
          onChange={(value) => setValue("worded", value)}
        />
      </div>

      <Button
        type="primary"
        loading={isUsernamePending}
        disabled={isUsernamePending}
        onClick={handleSubmit((data) => {
          return (
            isValid &&
            generateUsername({
              ...data,
              worded: data.worded === 2 ? "TWO" : "ONE",
              userId: user.userId!,
              isFav: false,
              isCombo: false,
              isUsername: true,
            })
          );
        })}
      >
        Submit
      </Button>
    </form>
  );
}
