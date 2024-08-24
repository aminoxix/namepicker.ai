import { useAuth } from "@clerk/nextjs";
import { Button, Input, Slider, Typography } from "antd";
import type {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type FormValues = {
  name: string;
  animal: string;
  background: string;
  hobby: string;
  aim: string;
  worded: number;
};

export default function FavForm({
  watch,
  setValue,
  register,
  handleSubmit,
  isFavPending,
  generateFavName,
}: {
  handleSubmit: UseFormHandleSubmit<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  isFavPending: boolean;
  generateFavName: (data: {
    aim: string;
    name: string;
    hobby: string;
    animal: string;
    background: string;
    worded: "ONE" | "TWO";
    userId: string;
    isFav: boolean;
    isCombo: boolean;
    isUsername: boolean;
  }) => void;
}) {
  const user = useAuth();

  return (
    <form className="flex flex-col gap-4">
      <div>
        <Typography.Title level={5}>First Name</Typography.Title>
        <Input
          type="text"
          placeholder="Let's start with your first name"
          {...register("name", { required: true, maxLength: 80 })}
          onChange={(e) => setValue("name", e.target.value)}
        />
      </div>
      <div>
        <Typography.Title level={5}>Animal</Typography.Title>
        <Input
          type="text"
          placeholder="What's your favorite animal?"
          {...register("animal", { required: true, maxLength: 100 })}
          onChange={(e) => setValue("animal", e.target.value)}
        />
      </div>
      <div>
        <Typography.Title level={5}>Background</Typography.Title>
        <Input
          type="text"
          placeholder="Experience in a few words"
          {...register("background", { required: true, maxLength: 100 })}
          onChange={(e) => setValue("background", e.target.value)}
        />
      </div>
      <div>
        <Typography.Title level={5}>Favorite Activity</Typography.Title>
        <Input
          type="text"
          placeholder="What's you do for fun?"
          {...register("hobby", { required: true, maxLength: 100 })}
          onChange={(e) => setValue("hobby", e.target.value)}
        />
      </div>
      <div>
        <Typography.Title level={5}>Aim</Typography.Title>
        <Input
          type="text"
          placeholder="What's your goal?"
          {...register("aim", { required: true, maxLength: 100 })}
          onChange={(e) => setValue("aim", e.target.value)}
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
        disabled={isFavPending}
        onClick={handleSubmit((data) => {
          console.log(data);
          return generateFavName({
            ...data,
            worded: data.worded === 2 ? "TWO" : "ONE",
            userId: user.userId!,
            isFav: true,
            isCombo: false,
            isUsername: false,
          });
        })}
      >
        Submit
      </Button>
    </form>
  );
}
