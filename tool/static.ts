/**
 * tool/static.ts
 * Static controller for static
 * @author DominicMing
 */

import { IContext } from "../server.ts";

const { cwd, stat, readFile } = Deno;

/**
 * extension name 2 mime type
 */
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
  ".7z": "application/x-7z-compressed",
} as {
  [type: string]: string;
};

const defaultOpts = {
  root: "",
  maxAge: 0,
  allowHidden: false,
  index: "index.html",
  immutable: false,
  pathRender: (str: string) => str,
};

/**
 * Generate a process function that can be fit into process
 * @deprecated
 * @param option
 */
export function staticProcess(option = {}) {
  const opt = { ...defaultOpts, ...option };

  return async function (context: IContext) {
    const { config, logger, method } = context;
    const { root, allowHidden, maxAge, index, immutable, pathRender } = opt;
    const path = pathRender(context.path);
    let filePath = (root || cwd()) + path;
    let file;

    config.mimeType = "";
    config.charset = "";

    if (!filePath.startsWith("/")) {
      filePath = cwd() + filePath;
    }

    if (method !== "GET" && method !== "HEAD") {
      logger.error("[STATIC] method not allowed", context.method);
      context.throw(405, "Method Not Allowed");
    }

    try {
      file = await stat(filePath);

      if (file.isDirectory) {
        if (!filePath.endsWith("/")) {
          filePath += "/";
        }

        file = await stat(filePath + index);
      }

      const ext = "." + filePath.split(".").pop();

      if (
        !allowHidden
      ) {
        const filename = filePath
          .split("/")
          .pop();
        if (filename && filename.startsWith(".")) {
          context.throw(403, "Forbidden File");
        }
      }

      if (file) {
        context.body = await readFile(filePath);

        if (ext2mime[ext]) {
          config.mimeType = ext2mime[ext];
        }
      } else {
        context.throw(404, "Not Found Route");
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
      logger.error("[STATIC] static file error", e);
      context.throw(404, "Not Found File");
    }

    if (!file) {
      context.throw(404, "Not Found File");
    }

    logger.trace(
      "[STATIC]",
      context.path,
      context.method,
      context.status,
      filePath,
    );
  };
}

/**
 * Static process class
 */
export class Static {
  root: string;
  maxAge: number;
  allowHidden: boolean;
  index: string;
  immutable: boolean;
  pathRender: (path: string) => string;

  constructor(opt = defaultOpts) {
    let { root, maxAge, allowHidden, index, pathRender, immutable } = opt;

    this.root = root;
    this.maxAge = maxAge;
    this.allowHidden = allowHidden;
    this.index = index;
    this.pathRender = pathRender;
    this.immutable = immutable;
  }

  /**
   * static process fit into server
   * @param context
   */
  controller = async (context: IContext) => {
    const { config, logger, method } = context;
    const { root, allowHidden, maxAge, index, immutable, pathRender } = this;
    const path = pathRender(context.path);
    let filePath = (root || cwd()) + path;
    let file;

    config.mimeType = "";
    config.charset = "";

    if (!filePath.startsWith("/")) {
      filePath = cwd() + filePath;
    }

    if (method !== "GET" && method !== "HEAD") {
      logger.error("[STATIC] method not allowed", context.method);
      context.throw(405, "Method Not Allowed");
    }

    try {
      file = await stat(filePath);

      if (file.isDirectory) {
        if (!filePath.endsWith("/")) {
          filePath += "/";
        }

        file = await stat(filePath + index);
      }

      const ext = "." + filePath.split(".").pop();

      if (
        !allowHidden
      ) {
        const filename = filePath
          .split("/")
          .pop();
        if (filename && filename.startsWith(".")) {
          context.throw(403, "Forbidden File");
        }
      }

      if (file) {
        context.body = await readFile(filePath);

        if (ext2mime[ext]) {
          config.mimeType = ext2mime[ext];
        }
      } else {
        context.throw(404, "Not Found Route");
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
      logger.error("[STATIC] static file error", e);
      context.throw(404, "Not Found File");
    }

    if (!file) {
      context.throw(404, "Not Found File");
    }

    logger.trace(
      "[STATIC]",
      context.path,
      context.method,
      context.status,
      filePath,
    );
  };
}
