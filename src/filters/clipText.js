const MAX_TEXT_LENGTH = 100;

export default function (text) {
  if (!text) {
    return null;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    const spaceIndex = text.indexOf(' ', MAX_TEXT_LENGTH);
    if (spaceIndex < 0) {
      return text;
    }
    return text.substr(0, spaceIndex) + '...';
  }

  return text;
}
