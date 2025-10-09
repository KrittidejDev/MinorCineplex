const timeFormat = (time: string) => {
    return new Date(time).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
};

export default timeFormat;