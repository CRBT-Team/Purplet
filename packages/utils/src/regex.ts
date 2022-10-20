export const SnowflakeRegex = /[0-9]{17,20}$/;

// All of the mention regexes use group syntax so that you can easily
// filter all IDs and emoji names in a message, for example.

export const CustomEmojiRegex = /<a?:(\w+):([0-9]{17,20})>/g;

export const UserMentionRegex = /<@!?([0-9]{17,20})>/g;

export const ChannelMentionRegex = /<#([0-9]{17,20})>/g;

export const RoleMentionRegex = /<@!?([0-9]{17,20})>/g;

export const SlashCommandMentionRegex = /<\/([\w ]+):([0-9]{17,20})>/g;

export const ImageUrlRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))(?:\?[^\s]+)?/g;
