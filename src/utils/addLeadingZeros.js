function addLeadingZeros(num) {
    // Convert the number to a string
    const numStr = num.toString();

    // Calculate the number of leading zeros required
    const leadingZeros = 3 - numStr.length;

    // Add leading zeros to the number
    const formattedNum = '0'.repeat(leadingZeros) + numStr;

    return formattedNum;
}

export { addLeadingZeros };