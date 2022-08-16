import OSS from './OSS.jsx';
import App from './App.jsx';

let OSSWrap = {
    upload: function (file, options = {}) {
        return App.api('adm/file/upload_token', {
            'fileName': file.name,
            'fileSize': file.size,
            namespace: options.namespace || 'file'
        }).then(function (cfg) {
            let client = new OSS({
                region: cfg.region,
                accessKeyId: cfg.accessKey,
                accessKeySecret: cfg.accessSecret,
                stsToken: cfg.stsToken,
                bucket: cfg.bucket
            });
            return client.multipartUpload(cfg.key, file, options).then(function () {
                return {'vendor': 'ali', 'bucket': cfg.bucket, 'key': cfg.key, 'url': cfg.url};
            });
        });
    }
};

export default OSSWrap;
