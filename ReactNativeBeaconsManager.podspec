Pod::Spec.new do |s|
  s.name         = "ReactNativeBeaconsManager"
  s.version      = "1.2.0"
  s.summary      = "React-Native library for detecting beacons (iOS and Android) - Expo compatible"
  s.homepage     = "https://github.com/MacKentoch/react-native-beacons-manager#readme"
  s.license      = { :type => "MIT" }
  s.authors      = { "Erwan DATIN" => "aidadayadkb@gmail.com" }
  s.platform     = :ios, "12.0"
  s.source       = { :path => "." }
  s.source_files = "ios", "ios/**/*.{h,m}"

  s.dependency 'React-Core'
end
