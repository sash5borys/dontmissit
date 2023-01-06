export const sliceDate = (dateText) => {
    const num = dateText.match(/\d+/);
    const token = dateText.match(/[a-z]/);
    return { num, token };
};