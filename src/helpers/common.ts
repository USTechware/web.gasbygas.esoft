export const isBrowser = () => typeof window !== "undefined";

export const generateRequestToken = (o: { name: string, district: string}) => {
    const outlet = o.name[0] + o.name[o.name.length - 1];
    const district = o.district[0] + o.district[o.district.length - 1];
    const uniqueNumber = Date.now().toString().slice(-6);

    return `${district}/${outlet}-${uniqueNumber}`;
};