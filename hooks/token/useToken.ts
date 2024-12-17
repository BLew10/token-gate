
import { Token } from "@/app/api/molaris/token/[ca]/route";
``
export const useToken = () => {
    const getToken = async (ca: string): Promise<Token | null> => {
        const response = await fetch(`/api/molaris/token/${ca}`);
        const data = await response.json();
        return data;
    };

    return { getToken };
};