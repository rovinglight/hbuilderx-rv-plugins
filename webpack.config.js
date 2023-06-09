const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");
const prettier = require("prettier");

module.exports = {
  entry: "./extension.js",
  mode: "production",
  output: {
    filename: "extension.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    libraryTarget: "commonjs"
  },
  externals: {
    hbuilderx: "commonjs hbuilderx"
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "package.json",
          to: "package.json",
          transform: fileBuffer => {
            const fileString = fileBuffer.toString();
            const packageJson = JSON.parse(fileString);
            delete packageJson.dependencies;
            delete packageJson.devDependencies;
            const alteredString = JSON.stringify(packageJson);
            return prettier.format(alteredString, { parser: "json" });
          }
        }
      ]
    }),
    new ZipPlugin({
      path: "./",
      filename: `rv-annotation.zip`,
      extension: "zip",
      fileOptions: {
        mtime: new Date(),
        mode: 0o100664,
        compress: true,
        forceZip64Format: false
      },
      zipOptions: {
        forceZip64Format: false
      }
    })
  ]
};
