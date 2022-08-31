module.exports = {
    StringToLink: function (string) {
        return string
            .replace("'", '')
            .replace('&', 'and')
            .replaceAll(' ', '-')
            .toLowerCase();
    },
    LinkToString: function (link) {
        return link
            .replaceAll('-', ' ')
            .replace('and', '&')
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
            .replace('Childrens', "Children's")
            .replace('Non Fiction', 'Non-Fiction');
    },
    LangToLink: function (lang) {
        return lang == 'English' ? 'vn' : 'en';
    },
    LinkToLang: function (link) {
        return link == 'en' ? 'English' : 'Vietnamese';
    },
};
