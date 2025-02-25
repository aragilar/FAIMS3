#!/bin/bash -euo pipefail
#https://pgu.dev/2020/12/16/ios-build-versioning.html

#!/bin/sh -euo pipefail

# Convert elapsed seconds from Unix epoch until now to minutes
# HOURS_SINCE_EPOCH=$(( $(date "+%s")/60/60 ))
#
# # Convert current git HEAD commit (7 characters) to decimal value
# #GIT_HASH_DECIMAL=$(printf "%d" 0x1"$(git rev-parse --short HEAD)")
#
# # Merge both values to a single string
# BUNDLE_VERSION="${HOURS_SINCE_EPOCH}"."${GIT_HASH_DECIMAL}"
#
# # Prepare directory / file where the generated value will be written.
# mkdir -p "${SRCROOT}"/Plist
# touch "${SRCROOT}"/Plist/Prefix
#
# # Write content to a file
# cat <<EOF > "${SRCROOT}"/Plist/Prefix
# #define BUNDLE_VERSION ${BUNDLE_VERSION}
# EOF


buildNumber=$(date -u "+%Y%m%d%H%M")
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildNumber" "App/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 0.3.0" "App/Info.plist"
