#!/usr/bin/env bash
#
# Takes the package.json location as an input.
package_json_path="$1"
targets="node8-linux,node8-windows,node8-macos"

# Create the Linux, Windows and MacOS packages.
npx pkg \
    --targets "$targets" \
    --out-path ./artifacts/packages \
    "$package_json_path"

# Now bulid *.deb, *.rpm etc with fpm.
# fpm todo
