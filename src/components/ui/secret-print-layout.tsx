import { Card, Text } from "@mantine/core";

const ThermalPrinterUI = ({
    name,
    secret,
}: {
    name: string;
    secret: string;
}) => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-xs text-center border border-gray-600 rounded-lg">
                <Card shadow="sm" padding="lg" className="p-4">
                    <p className="mb-2">
                        <strong>Name:</strong> {name}
                    </p>

                    <div className="my-8">
                        <strong>Your Secret</strong>
                        <p className="text-center bg-gray-200 mt-2 p-4 rounded-lg">
                            <div className="text-4xl mt-2 text-black font-mono">
                                {secret}
                            </div>
                        </p>
                    </div>

                    <div className="mt-6">
                        <Text size="sm">Powered by Betopia HRM System</Text>
                    </div>
                </Card>

                {/* Dotted Line Outside the Card */}
                <div className="mt-4 border-t-2 border-dotted border-gray-600 my-6"></div>
            </div>
        </div>
    );
};

export default ThermalPrinterUI;
