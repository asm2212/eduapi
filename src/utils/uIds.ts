const generateShortId = () => {
    return Math.random().toString(36).substring(2, 7);
};

export default generateShortId;
