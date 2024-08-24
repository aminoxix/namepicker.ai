import { useAuth } from "@clerk/nextjs";
import { Button, Input, Switch, Typography } from "antd";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type FormValues = {
  partner1: string;
  partner2: string;
  gender: "GIRL" | "BOY";
};

export type ComboFormType = {
  handleSubmit: UseFormHandleSubmit<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  isComboPending: boolean;
  isValid: boolean;
  generateComboName: (data: {
    partner1: string;
    partner2: string;
    gender: "GIRL" | "BOY";
    userId: string;
    isFav: boolean;
    isCombo: boolean;
    isUsername: boolean;
  }) => void;
};

export default function ComboForm({
  watch,
  errors,
  isValid,
  setValue,
  register,
  handleSubmit,
  isComboPending,
  generateComboName,
}: ComboFormType) {
  const user = useAuth();

  return (
    <form className="flex flex-col gap-4">
      <div>
        <Typography.Title level={5}>Your name</Typography.Title>
        <Input
          type="text"
          placeholder="Please share your first name"
          {...register("partner1", { required: true, maxLength: 100 })}
          onChange={(e) => setValue("partner1", e.target.value)}
          status={errors.partner1 && "error"}
        />
      </div>
      <div>
        <Typography.Title level={5}>Partner&apos;s name</Typography.Title>
        <Input
          type="text"
          placeholder="Please share first name of your partner"
          {...register("partner2", { required: true, maxLength: 80 })}
          onChange={(e) => setValue("partner2", e.target.value)}
          status={errors.partner2 && "error"}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Typography.Title level={5}>Looking for?</Typography.Title>
        <Switch
          defaultChecked
          checkedChildren="Girl"
          unCheckedChildren="Boy"
          checked={watch("gender") === "GIRL"}
          onChange={(checked) => setValue("gender", checked ? "GIRL" : "BOY")}
        />
      </div>

      <Button
        type="primary"
        loading={isComboPending}
        disabled={isComboPending}
        onClick={handleSubmit((data) => {
          return (
            isValid &&
            generateComboName({
              ...data,
              userId: user.userId!,
              isFav: false,
              isCombo: true,
              isUsername: false,
            })
          );
        })}
      >
        Submit
      </Button>
    </form>
  );
}
