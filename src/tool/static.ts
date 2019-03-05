import { errorBodyGen } from "./body.ts";

const ext2mime = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/x-freearc",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bmp": "image/bmp",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
  ".csh": "application/x-csh",
  ".css": "text/css",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".eot": "application/vnd.ms-fontobject",
  ".epub": "application/epub+zip",
  ".gif": "image/gif",
  ".htm": "text/html",
  ".html": "text/html",
  ".ico": "image/vnd.microsoft.icon",
  ".ics": "text/calendar",
  ".jar": "application/java-archive",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mid": "audio/midi audio/x-midi",
  ".midi": "audio/midi audio/x-midi",
  ".mjs": "text/javascript",
  ".mp3": "audio/mpeg",
  ".mpeg": "video/mpeg",
  ".mpkg": "application/vnd.apple.installer+xml",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".ogx": "application/ogg",
  ".otf": "font/otf",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".rar": "application/x-rar-compressed",
  ".rtf": "application/rtf",
  ".sh": "application/x-sh",
  ".svg": "image/svg+xml",
  ".swf": "application/x-shockwave-flash",
  ".tar": "application/x-tar",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".vsd": "application/vnd.visio",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml":
    "application/xml if not readable from casual users (RFC 3023, section 3)",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip",
  ".3gp": "video/3gpp",
  ".3g2": "video/3gpp2",
  ".7z": "application/x-7z-compressed"
};

const { cwd, stat, readFile } = Deno;

const defaultOpts = {
  root: "",
  maxAge: 0,
  allowHidden: false,
  index: "index.html",
  immutable: false
};

export function staticProcess(option = {}) {
  const opt = { ...defaultOpts, ...option };

  return async function(context) {
    const { config, logger } = context;
    const { root, allowHidden, maxAge, index, immutable } = opt;
    let filePath = (root || cwd()) + context.path;
    let file;

    config.mimeType = "";
    config.charset = "";

    if (!filePath.startsWith("/")) {
      filePath = cwd() + filePath;
    }

    try {
      file = await stat(filePath);

      if (file.isDirectory()) {
        if (!filePath.endsWith("/")) {
          filePath += "/";
        }

        file = await stat(filePath + index);
      }

      const ext = "." + filePath.split(".").pop();

      if (
        !allowHidden &&
        filePath
          .split("/")
          .pop()
          .startsWith(".")
      ) {
        context.body = errorBodyGen("403", "Forbidden File");
        context.status = 403;
        throw new Error("Hidden file not allowed");
      }

      if (file) {
        context.body = await readFile(filePath);

        if (ext2mime[ext]) {
          config.mimeType = ext2mime[ext];
        }
      } else {
        context.body = errorBodyGen("404", "Not found the file");
        context.status = 404;
      }

      if (maxAge || immutable) {
        const cc = [];

        if (maxAge) {
          cc.push("max-age=" + maxAge / 1000);
        }

        if (immutable) {
          cc.push("immutable");
        }

        context.headers.append("cache-control", cc.join(","));
      }
    } catch (e) {
      logger.error("static file error", e);
    }

    if (!file) {
      context.body = errorBodyGen("404", "Not found the file");
      context.status = 404;
      config.mimeType = "text/html";
      console.log(404, filePath);
    }
  };
}
