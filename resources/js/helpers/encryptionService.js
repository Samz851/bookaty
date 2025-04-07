var CryptoJS = require("crypto-js");


export default class EncryptionService {

    constructor ( key )  {
        this.key = key;
    }

    encrypt ( text ) {
        return CryptoJS.AES.encrypt(text, this.key);
    }

    decrypt ( text ) {
        return CryptoJS.AES.decrypt(text, this.key);
    }

    encryptToString ( text ) {
      return this.encrypt( text ).toString();
    }

    decryptToString ( text ) {
      return this.decrypt( text ).toString( CryptoJS.enc.Utf8 );
    }
}