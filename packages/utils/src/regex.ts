export const SnowflakeRegex = /^[0-9]{17,20}$/;

export const EmojiRegex = /<a?:(\w+):(^[0-9]{17,20}>)/g;

export const UrlRegex = /(https?:\/\/[^\s]+)/g;

export const ImageUrlRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))(?:\?[^\s]+)?/g;
