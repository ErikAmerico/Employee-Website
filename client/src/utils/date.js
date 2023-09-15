import dayjs from "dayjs";

export const formatDate = (timeStamp) => {
    const milliseconds = parseInt(timeStamp);
    return dayjs(milliseconds).format("MM/DD/YYYY h:mm A");
};
