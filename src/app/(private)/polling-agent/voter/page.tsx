"use client";

import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlinePersonOff } from "react-icons/md";
import CenterWrapper from "@/components/layout/center-wrapper";
import Header from "@/components/layout/header";
import PaperWrapper from "@/components/layout/paper-wrapper";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const [searched, setSearched] = useState(false);
  const [filteredRows, setFilteredRows] = useState<TRow[]>([]);
  const session = useAuth();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      method: "national_id",
      query: "",
    },
    validate: {
      method: (method) => !method && "Searching method is required.",
      query: (query) => !query && "Searching query is required.",
    },
  });

  const rows: TRow[] = [
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

  const columns = [
    { label: "Voter ID", key: "voter_id" },
    { label: "First Name", key: "first_name" },
    { label: "Last Name", key: "last_name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ];

  const handleSearch = (values: typeof form.values) => {
    const result = rows.filter((r) =>
      String(r[values.method as keyof TRow])
        .toLowerCase()
        .includes(values.query.toLowerCase()),
    );
    setFilteredRows(result);
    setSearched(true);
  };

  return (
    <CenterWrapper>
      <PaperWrapper>
        <div className="w-full sm:w-3xl mx-auto">
          <Header />

          {/* Search Form */}
          <form
            onSubmit={form.onSubmit(handleSearch)}
            className="px-6 sm:px-20 space-y-4"
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
                    label: "National ID / Driving License (Last 5 Digits)",
                    value: "national_id",
                  },
                  { label: "Email", value: "email" },
                  { label: "Phone", value: "phone" },
                  {
                    label: "First Name",
                    value: "first_name",
                  },
                  { label: "Last Name", value: "last_name" },
                ]}
                {...form.getInputProps("method")}
              />

              <TextInput
                placeholder={
                  form.values.method === "national_id"
                    ? "Enter National ID / Driving License (Last 5 Digits)"
                    : form.values.method === "email"
                      ? "Enter Email Address"
                      : form.values.method === "first_name"
                        ? "Enter First Name"
                        : form.values.method === "last_name"
                          ? "Enter Last Name"
                          : "Enter Phone Number"
                }
                type={form.values.method === "email" ? "email" : "text"}
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

          {/* Search Result Table */}
          {searched && (
            <VoterTable
              columns={columns}
              rows={filteredRows}
              onRetry={() => setSearched(false)}
            />
          )}
        </div>
      </PaperWrapper>
    </CenterWrapper>
  );
}

/* ------------------------------ Types ------------------------------ */
type TRow = {
  voter_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

/* ----------------------------- Table UI ----------------------------- */
const VoterTable = ({
  columns,
  rows,
  onRetry,
}: {
  columns: { label: string; key: string }[];
  rows: TRow[];
  onRetry: () => void;
}) => {
  const router = useRouter();

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm text-left rounded-lg overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 font-medium border-b border-primary/20"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-gray-500"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-red-100 text-red-500 p-5 rounded-full">
                    <MdOutlinePersonOff size={40} />
                  </div>
                  <p className="text-gray-600 font-medium">No Voter Found</p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((x, idx) => (
              <tr
                key={idx}
                onClick={() =>
                  router.push(`/polling-agent/voter/${x.voter_id}`)
                }
                className="even:bg-gray-50 odd:bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 border-b border-gray-100"
                  >
                    {x[col.key as keyof TRow] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
