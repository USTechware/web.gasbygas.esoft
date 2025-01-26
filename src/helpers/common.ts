export const isBrowser = () => typeof window !== "undefined";

export const generateRequestToken = (o: { name: string, district: string}) => {
    const district = o.district.slice(0, 3);
    const outlet = o.name.slice(0, 3);
    const uniqueNumber = Date.now().toString().slice(-6);

    return `${district}/${outlet}-${uniqueNumber}`.toUpperCase();
};