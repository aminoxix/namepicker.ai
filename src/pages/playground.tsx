import { useState } from "react";

import ComboForm, {
  type FormValues as ComboFormValues,
} from "@/components/forms/combo";
import FavForm, {
  type FormValues as FavFormValues,
} from "@/components/forms/fav";
import UsernameForm, {
  type FormValues as UsernameFormValues,
} from "@/components/forms/username";
import { useForm } from "react-hook-form";

import { api } from "@/utils/api";
import { Card, Drawer, Segmented } from "antd";
import Markdown from "marked-react";

import {
  CrownTwoTone,
  FireTwoTone,
  PauseCircleTwoTone,
  SkinTwoTone,
} from "@ant-design/icons";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";

export type SegmentedValue = "BEST_FOR_YOU" | "PICK_USERNAME" | "BABY_NAMING";

const Playground = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string>("");
  const [selected, setSelected] = useState<SegmentedValue>("BEST_FOR_YOU");

  const {
    watch: favWatch,
    register: favRegister,
    setValue: favSetValue,
    handleSubmit: favHandleSubmit,
    formState: { errors: favErrors, isValid: favIsValid },
  } = useForm<FavFormValues>({
    mode: "onChange",
    defaultValues: {
      aim: "",
      name: "",
      hobby: "",
      worded: 1,
      animal: "",
      background: "",
    },
  });

  const {
    watch: comboWatch,
    register: comboRegister,
    setValue: comboSetValue,
    handleSubmit: comboHandleSubmit,
    formState: { errors: comboErrors, isValid: comboIsValid },
  } = useForm<ComboFormValues>({
    mode: "onChange",
    defaultValues: {
      partner1: "",
      partner2: "",
      gender: "GIRL",
    },
  });

  const {
    watch: usernameWatch,
    register: usernameRegister,
    setValue: usernameSetValue,
    handleSubmit: usernameHandleSubmit,
    formState: { errors: usernameErrors, isValid: usernameIsValid },
  } = useForm<UsernameFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      worded: 1,
    },
  });

  const { mutate: generateFavName, isPending: isFavPending } =
    api.generator.generateFavName.useMutation({
      onSuccess: (successor: { message: string; response: string }) => {
        setData(successor.response);
        setOpen(true);
      },
      onError: (error) => {
        console.error("Favorite name generation failed", error);
      },
    });

  const { mutate: generateComboName, isPending: isComboPending } =
    api.generator.generateComboName.useMutation({
      onSuccess: (successor: { message: string; response: string }) => {
        setData(successor.response);
        setOpen(true);
      },
      onError: (error) => {
        console.error("Combos name generation failed", error);
      },
    });

  const { mutate: generateUsername, isPending: isUsernamePending } =
    api.generator.generateUsername.useMutation({
      onSuccess: (successor: { message: string; response: string }) => {
        setData(successor.response);
        setOpen(true);
      },
      onError: (error) => {
        console.error("Combos name generation failed", error);
      },
    });

  return (
    <div className="h-screen min-w-full bg-primary px-5 py-8">
      <div className="mx-auto flex h-full max-w-3xl flex-col justify-center gap-4 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Playground</h1>
          <SignedIn>
            <div className="flex items-center">
              <span className="pr-2 text-sm">signed in as</span>
              <UserButton />
            </div>
          </SignedIn>
        </div>
        <Segmented
          block
          value={selected}
          onChange={setSelected}
          defaultValue="BEST_FOR_YOU"
          options={[
            {
              label: (
                <div className="flex h-11 items-center justify-center gap-2">
                  <FireTwoTone />
                  <span className="hidden sm:block">Best for you</span>
                </div>
              ),
              value: "BEST_FOR_YOU",
            },
            {
              label: (
                <div className="flex h-11 items-center justify-center gap-2">
                  <CrownTwoTone />
                  <span className="hidden sm:block">Pick username</span>
                </div>
              ),
              value: "PICK_USERNAME",
            },
            {
              label: (
                <div className="flex h-11 items-center justify-center gap-2">
                  <SkinTwoTone />
                  <span className="hidden sm:block">Baby naming</span>
                </div>
              ),
              value: "BABY_NAMING",
            },
          ]}
        />

        {isFavPending ? (
          <Card loading={true} style={{ minWidth: 300 }} />
        ) : (
          <Card>
            <Drawer
              open={open}
              title="Generated content"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              onClose={() => setOpen(false)}
            >
              {data ? (
                data
                  .split("\n")
                  .filter((line) => line)
                  .map((line, index) => <Markdown key={index}>{line}</Markdown>)
              ) : (
                <div className="text-center">
                  <PauseCircleTwoTone />
                  <p>No data generated yet.</p>
                </div>
              )}
            </Drawer>
            {selected === "BEST_FOR_YOU" ? (
              <FavForm
                watch={favWatch}
                errors={favErrors}
                isValid={favIsValid}
                setValue={favSetValue}
                register={favRegister}
                handleSubmit={favHandleSubmit}
                isFavPending={isFavPending}
                generateFavName={generateFavName}
              />
            ) : selected === "PICK_USERNAME" ? (
              <span>
                <UsernameForm
                  watch={usernameWatch}
                  errors={usernameErrors}
                  isValid={usernameIsValid}
                  setValue={usernameSetValue}
                  register={usernameRegister}
                  handleSubmit={usernameHandleSubmit}
                  isUsernamePending={isUsernamePending}
                  generateUsername={generateUsername}
                />
              </span>
            ) : selected === "BABY_NAMING" ? (
              <span>
                <ComboForm
                  watch={comboWatch}
                  errors={comboErrors}
                  isValid={comboIsValid}
                  setValue={comboSetValue}
                  register={comboRegister}
                  handleSubmit={comboHandleSubmit}
                  isComboPending={isComboPending}
                  generateComboName={generateComboName}
                />
              </span>
            ) : null}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Playground;
