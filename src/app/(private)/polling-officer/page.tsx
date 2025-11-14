"use client";

import { Voter } from "@/@types/voter";
import CenterWrapper from "@/components/layout/center-wrapper";
import Header from "@/components/layout/header";
import PaperWrapper from "@/components/layout/paper-wrapper";
import { useVoterSearchQuery } from "@/services/api/poll-officer.api";
import { useVoterStore } from "@/store/voter-store";
import { Button, Loader, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlinePersonOff } from "react-icons/md";
import { useVoteStore } from "../election/vote/vote.store";

type SearchMethod = "national_id" | "email" | "phone" | "full_name";

export default function Page() {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState<{
        type: SearchMethod;
        query: string;
    } | null>(null);

    const form = useForm<{ method: SearchMethod; query: string }>({
        initialValues: { method: "national_id", query: "" },
        validate: {
            method: (v) => !v && "Search method is required",
            query: (v) => !v && "Search query is required",
        },
    });

    // Fetch only when searchParams is not null
    const { data, isLoading, isError } = useVoterSearchQuery(
        {
            type: (searchParams?.type as any) ?? "national_id",
            query: searchParams?.query ?? "",
        },
        { enabled: !!searchParams } // only when button clicked
    );

    const handleSearch = (values: typeof form.values) => {
        setSearchParams({ type: values.method, query: values.query });
    };

    useEffect(() => {
        if (data?.voters?.length === 1) {
            let x = data?.voters[0];
            router.push(`/polling-officer/voter/${x.uuid}`);
            useVoterStore.setState({ voter: x as any });
            useVoteStore.setState({ ballotNumber: x.ballot_number });
        }
    }, [data]);

    return (
        <CenterWrapper>
            <PaperWrapper>
                <div className="w-full sm:w-4xl mx-auto">
                    <Header />

                    {/* Search Form */}
                    <form
                        onSubmit={form.onSubmit(handleSearch)}
                        className="px-6 sm:px-20 space-y-4 max-w-3xl mx-auto "
                    >
                        <div className="size-20 sm:size-28 mx-auto">
                            <Image
                                src="/bag_logo.png"
                                height={200}
                                width={200}
                                alt="bag_logo"
                            />
                        </div>

                        <h1 className="font-semibold text-2xl text-primary text-center">
                            Polling Agent
                        </h1>

                        <div className="space-y-3 mt-5">
                            <h1 className="text-center text-gray-700 font-medium">
                                BAG Voter Search
                            </h1>

                            <Select
                                placeholder="Select Search Method"
                                data={[
                                    {
                                        label: "ID / Driving License (Last 5 Digits)",
                                        value: "national_id",
                                    },
                                    { label: "Email", value: "email" },
                                    { label: "Phone", value: "phone" },
                                    {
                                        label: "Full Name",
                                        value: "full_name",
                                    },
                                ]}
                                {...form.getInputProps("method")}
                            />

                            <TextInput
                                placeholder={
                                    form.values.method === "national_id"
                                        ? "Enter ID / Driving License (Last 5 Digits)"
                                        : form.values.method === "email"
                                        ? "Enter Email Address"
                                        : form.values.method === "full_name"
                                        ? "Enter Full Name"
                                        : "Enter Phone Number"
                                }
                                type={
                                    form.values.method === "email"
                                        ? "email"
                                        : form.values.method === "national_id"
                                        ? "number"
                                        : "text"
                                }
                                {...form.getInputProps("query")}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                rightSection={<FiSearch size={16} />}
                                mt={20}
                            >
                                Search
                            </Button>
                        </div>
                    </form>

                    {/* Result Section */}
                    <div className="mt-8 px-6 sm:px-10">
                        {isLoading && (
                            <div className="flex justify-center py-10">
                                <Loader color="green" />
                            </div>
                        )}

                        {!isLoading && searchParams && (
                            <VoterTable
                                columns={[
                                    {
                                        label: "ID/Driver's License",
                                        key: "national_id",
                                    },
                                    {
                                        label: "Voter ID",
                                        key: "voter_id_generated",
                                    },
                                    { label: "Full Name", key: "full_name" },
                                    { label: "Email", key: "email" },
                                    { label: "Phone", key: "phone" },
                                ]}
                                rows={data?.voters ?? []}
                            />
                        )}

                        {isError && (
                            <p className="text-center text-red-500 py-10">
                                Something went wrong. Please try again.
                            </p>
                        )}
                    </div>
                </div>
            </PaperWrapper>
        </CenterWrapper>
    );
}

/* ----------------------------- Table UI ----------------------------- */
const VoterTable = ({
    columns,
    rows,
}: {
    columns: { label: string; key: string }[];
    rows: Voter[];
}) => {
    const router = useRouter();

    if (rows.length === 0)
        return (
            <div className="py-10 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-red-100 text-red-500 p-5 rounded-full">
                        <MdOutlinePersonOff size={40} />
                    </div>
                    <p className="text-gray-600 font-medium">No Voter Found</p>
                </div>
            </div>
        );

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-primary text-white sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 font-medium border-b border-primary/20 bg-primary sticky top-0"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((x, idx) => (
                            <tr
                                key={idx}
                                onClick={() => {
                                    router.push(
                                        `/polling-officer/voter/${x.uuid}`
                                    );
                                    useVoterStore.setState({ voter: x as any });
                                }}
                                className="even:bg-gray-50 odd:bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className="px-4 py-2 border-b border-gray-100"
                                    >
                                        {col.key === "full_name"
                                            ? `${x.first_name} ${
                                                  x.middle_name ?? ""
                                              } ${x.last_name}`
                                            : x[col.key as keyof typeof x] ??
                                              "N/A"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
