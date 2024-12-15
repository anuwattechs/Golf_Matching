import * as admin from 'firebase-admin';

export const initializeFirebaseApp = () => {
  const serviceAccount = {
    type: 'service_account',
    project_id: 'golink-golf-eb94a',
    private_key_id: 'dbb4609d90b497e23826b660431f6a127e3c64e9',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZ4oT/qCn2N/HF\nWbc9pKDzFx2p7IbL7UFUQ9BB0PICBOyh9Zu4J4lUduBSKSSVxQpVMmZxfe2qSqcc\nRmBDba+oEnOtXGLo8Jydnre+b8DDPCInWYAU34XDHa9SF3IzYSwx6iyr41vDh4ni\nmVi0P5zb+tXhUENk++MQgp3agD4yXtesO+R4CP/toCIHJXsikwrwNU1r9AyR54KY\nWo1ufvO5aAd5oUE2M1DM0vhtuT9Triz0SP79bKAfsK7mcyqH7PiEsqUe8+R/tvkn\nLCF05PpnM0p+hlgYqfL5rTOxxl91S43NY47l9qkOH4nSkeBlhvW1WDwDhzCAA1VQ\nJT1UBZ2tAgMBAAECggEANWQFwaz4PVqnnru1hIAxJWhCb1djj5iPg+HLKDmWd+qz\nfpt0AUwE4aLwpIlq6t1aAxcC1egtAyfga7QOFi/MVaPR30cOgLSnOBOCxIJXaq/z\nUY+jrFm6ih2dzsCqjg8PeJrAwA0KOS9fGR0JCMA2xIvieaAEp7v2f9715es7cnVp\npwYmXd6KAmdajbu1NoyIvPyvCKv6xmmo8HywETRMvjn2hxCp8j3zN0fk90QFrFwH\n2jjtnM4dJ4I7HVk9sJ7JHuo57MANKAN5syWOyQPOSk4RIyZ5OJgb/9yw3Mc9EzgT\nkZPQElFg2QI7jyNieLDTTdOc8QUJyNZEeCcohChUaQKBgQD8IgKjs7nhcKCdBGZy\nK6G2k8L/sRQmaLaagEPCGv5/ll8crrX664MJQozjlCPlLGtEfGV7aeULrrB+dqwH\nVXV2m9nKuut4ZEgjZ9WK8SHrI3BoOGWHBASMRKG7E/PH2fQMDr792u8tZuHyDSHF\nzfgRTlGmqsGUW/YbFXg73pWiCQKBgQDdOgknIim7QrlfPLoyolshEBAG+GcNKosG\n+jWryOKdcII2QLUx1UDNCsSmF/DQfzx/FiVsrmwiVoZNdsAYTsQ0HlDGi2xkweDj\noUsag0Ij4OrmjwAkzjawjuUhKjJ6vxEtu7xJ0RauGrEYlpmqCiQfqBYLu/cEocLl\n1seZutS3hQKBgBt6AVuhrHIa+gXigt+STa897xQ6Uf3Vj4DK1ZeDpZR16KuRhpdv\nrvoFXKE4daj17EKsY8rNQX7CbM17VUf/Uiu41EU5lYurMglZuXXIzW94jzlsW/QY\nxf4bRJzEkd6HrAbcXIgBoesKuTjNoY6S4aPRKyjElw/57ZoJ/u5XVWsxAoGBAIR7\nb+XGmLUy9S4qgNs3zVkUdHSoJ5aD5rQr/R499DASo3f38krAickA7NkGt0k1GTaG\nPa1DGzDJHi6fsdQcv3Tyvq7X6fbBAHtxKTfcaSxxUlr2QkDIWYoMWP0udwJ5D8GS\njuSp2Wo0Q+AUuDtTTWTD1Uf7radRdBUONYRDlYW9AoGBAPJXd+jRH6xrUsmCwZ+m\nEfGPjREyDoY3cDDWYcBwL3ELSq8PSyoRMQCGcUW6tMGaKG4H96brjkH9OvlHb9f8\n9TLoy0iEpYXhKncl7S3uXF+p7bVFUdNol9+GHjWf9LeJFQSaWVR+ukUKySd/ctu2\nR5Gs62vdn/yF4CaF8HbX/7DO\n-----END PRIVATE KEY-----\n',
    client_email:
      'firebase-adminsdk-8uq1y@golink-golf-eb94a.iam.gserviceaccount.com',
    client_id: '114624853180484856009',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8uq1y%40golink-golf-eb94a.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  };
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
      }),
    });
  }
};
