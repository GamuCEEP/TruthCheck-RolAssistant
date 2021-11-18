

const extensionRegex = /\.(\w+)$/;//Gets the extension (a '.'followed by letters at the end of string)

const contentTypes = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "": "text/plain"
};

function getContentType(url){
    return contentTypes[url.match(extensionRegex)];
}

module.exports = {getContentType};

