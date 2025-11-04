"use client";
import CenterWrapper from "@/components/layout/center-wrapper";
import PaperWrapper from "@/components/layout/paper-wrapper";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdLogin } from "react-icons/md";

export default function PollingAgentLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (_email) => !_email && "Email is required",
      password: (_password) => !_password && "Password is required",
    },
    validateInputOnBlur: true,
  });
  const handleLogin = async (values: typeof form.values) => {
    try {
      setLoading(true);
      // auth action
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/polling-agent/voter");
      } else {
        notifications.show({
          color: "red",
          title: "Failed",
          message: JSON.stringify(res?.error),
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <CenterWrapper>
      <PaperWrapper>
        <div>
          <form
            onSubmit={form.onSubmit(handleLogin)}
            className="  space-y-3   w-lg p-20 py-10"
          >
            <div className=" size-10 sm:size-16 mx-auto">
              <Image
                src={"/bag_logo.png"}
                className=""
                height={200}
                width={200}
                alt="bag_logo"
              />
            </div>
            <h1 className=" font-semibold text-2xl text-primary text-center">
              Polling Agent Login
            </h1>
            <div className=" space-y-1 mt-5">
              <TextInput
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                classNames={{
                  input: "placeholder:text-center",
                }}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Password"
                classNames={{
                  innerInput: "placeholder:text-center placeholder:mt-10",
                }}
                {...form.getInputProps("password")}
              />
              <Button
                type="submit"
                fullWidth
                mt={30}
                loading={loading}
                rightSection={<MdLogin size={20} />}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </PaperWrapper>
    </CenterWrapper>
  );
}
