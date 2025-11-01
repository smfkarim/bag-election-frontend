"use client";
import CenterWrapper from "@/components/layout/center-wrapper";
import PaperWrapper from "@/components/layout/paper-wrapper";
import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function page() {
    const [searched, setSearched] = useState(false);
    const form = useForm({
        initialValues: {
            method: "national_id",
            query: "",
        },
        validate: {
            method: (_method) => !_method && "Searching method is required.",
            query: (_query) => {
                if (!_query) return "Searching query is required.";
                // if(!_)
            },
        },
    });

    const handleSearch = async (values: typeof form.values) => {
        try {
            // search api
            setSearched(true);
        } catch (error) {}
    };

    const columns = [
        {
            label: "Voter Id",
            key: "voter_id",
        },
        {
            label: "First Name",
            key: "first_name",
        },
        {
            label: "Last Name",
            key: "last_name",
        },
        {
            label: "Email",
            key: "email",
        },
        {
            label: "Phone",
            key: "phone",
        },
    ];
    const rows = [
        {
            voter_id: "83999222",
            first_name: "Albi Ummid",
            last_name: "Tanvir",
            email: "albiummid@gmail.com",
            phone: "+88088776644",
        },
        {
            voter_id: "9898977",
            first_name: "Juned Ahmed",
            last_name: "Chowdhury",
            email: "junedchowdhury1@gmail.com",
            phone: "+88088776644",
        },
        {
            voter_id: "9898977",
            first_name: "SMF",
            last_name: "Karim",
            email: "smfkarim@gmail.com",
            phone: "+88088776644",
        },
        {
            voter_id: "9898977",
            first_name: "Sujon",
            last_name: "Mahmud",
            email: "sujonmahmud@gmail.com",
            phone: "+88088776644",
        },
    ];

    return (
        <CenterWrapper>
            <PaperWrapper>
                <div className=" w-4xl">
                    <form
                        onSubmit={form.onSubmit(handleSearch)}
                        className="px-20  space-y-2 sm:w-lg mx-auto"
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
                            Polling Agent
                        </h1>
                        <div className=" space-y-2 mt-5">
                            <h1 className=" text-center">BAG Voter Search</h1>
                            <Select
                                placeholder="Select Search Method"
                                {...form.getInputProps("method")}
                                data={[
                                    {
                                        label: "National ID / Driving License (Last 5 Digit) ",
                                        value: "national_id",
                                    },
                                    {
                                        label: "Email",
                                        value: "email",
                                    },
                                    {
                                        label: "Phone",
                                        value: "phone",
                                    },
                                    {
                                        label: "First Name",
                                        value: "first_name",
                                    },
                                    {
                                        label: "Last Name",
                                        value: "last_name",
                                    },
                                ]}
                            />
                            <TextInput
                                placeholder={
                                    form.values.method === "national_id"
                                        ? "National ID / Driving License (Last 5 Digit) "
                                        : form.values.method === "email"
                                        ? "Enter Email Address"
                                        : form.values.method === "first_name"
                                        ? "Enter first name"
                                        : form.values.method === "last_name"
                                        ? "Enter last name"
                                        : "Enter phone number"
                                }
                                type={
                                    form.values.method === "email"
                                        ? "email"
                                        : "text"
                                }
                                {...form.getInputProps("query")}
                            />
                            <Button
                                onClick={() => {
                                    setSearched(false);
                                }}
                                fullWidth
                                type="submit"
                                rightSection={<FiSearch size={16} />}
                                mt={20}
                            >
                                Search
                            </Button>
                        </div>
                    </form>
                    {searched && <VoterTable columns={columns} rows={rows} />}
                </div>
            </PaperWrapper>
        </CenterWrapper>
    );
}

type TRow = {
    voter_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
};

const VoterTable = (props: {
    columns: { label: string; key: string }[];
    rows: TRow[];
}) => {
    const router = useRouter();

    return (
        <div className=" ">
            <table className="  mt-10 w-4xl ">
                <thead className=" bg-primary text-white ">
                    {props.columns?.map((thCol) => (
                        <th key={thCol.label} className=" py-5">
                            {thCol.label}
                        </th>
                    ))}
                </thead>
            </table>
            <div className=" h-40 overflow-y-auto">
                <table className="w-4xl">
                    <tbody className=" h-5 overflow-y-auto">
                        {props.rows?.map((x, idx) => {
                            return (
                                <tr
                                    onClick={() => {
                                        router.push(`/voter/${x.voter_id}`);
                                    }}
                                    key={idx}
                                    className=" even:bg-green-50 odd:bg-gray-50 hover:cursor-pointer hover:bg-green-200"
                                >
                                    {props.columns?.map((col, colIdx) => {
                                        const accessorKey = col.key;
                                        const value =
                                            x?.[
                                                accessorKey as keyof typeof x
                                            ] ?? "N/A";

                                        return (
                                            <td
                                                key={col.label}
                                                className=" text-center py-3"
                                            >
                                                {value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
