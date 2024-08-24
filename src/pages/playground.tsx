import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import FavForm, {
  type FormValues as FavFormValues,
} from "@/components/forms/fav";
import { useForm } from "react-hook-form";

import { api } from "@/utils/api";
import { Card, Drawer, Segmented } from "antd";

import { CrownTwoTone, FireTwoTone, SkinTwoTone } from "@ant-design/icons";
import { SignedIn, useAuth, UserButton } from "@clerk/nextjs";

export type SegmentedValue = "BEST_FOR_YOU" | "PICK_USERNAME" | "BABY_NAMING";

const Playground = () => {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.userId) {
      void router.push("/");
    }
  }, [router, user?.userId]);

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string>("");
  const [selected, setSelected] = useState<SegmentedValue>("BEST_FOR_YOU");

  const { register, handleSubmit, watch, setValue } = useForm<FavFormValues>();

  const { mutate: generateFavName, isPending: isFavPending } =
    api.favGenerator.generateFavName.useMutation({
      onSuccess: (successor: { message: string; response: string }) => {
        setData(successor.response);
        setOpen(true);
      },
      onError: (error) => {
        console.error("Fav name generation failed", error);
      },
    });

  return (
    <div className="h-screen min-w-full bg-primary">
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
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              title="Generated content"
              onClose={() => setOpen(false)}
              open={open}
            >
              <p>{data.toString()}</p>
            </Drawer>
            {selected === "BEST_FOR_YOU" ? (
              <FavForm
                watch={watch}
                setValue={setValue}
                register={register}
                handleSubmit={handleSubmit}
                isFavPending={isFavPending}
                generateFavName={generateFavName}
              />
            ) : selected === "PICK_USERNAME" ? (
              <span>
                Coming soon! <span className="text-2xl">👑</span>
              </span>
            ) : selected === "BABY_NAMING" ? (
              <span>
                Coming soon! <span className="text-2xl">👶</span>
              </span>
            ) : null}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Playground;
