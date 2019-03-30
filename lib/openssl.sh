# For Further Infomation, Visit https://fatfatson.github.io/2018/07/27/openssl%E8%B5%B0%E4%B8%80%E8%BD%AECA%E8%AF%81%E4%B9%A6%E7%AD%BE%E5%8F%91%E7%9A%84%E8%BF%87%E7%A8%8B%E5%92%8C%E5%90%84%E4%B8%AA%E6%96%87%E4%BB%B6%E4%BD%9C%E7%94%A8/ 
#
# If -subj doesn;t work, 
# just ignore it and enter the config later, by questionaire.

#########################
# CA
#########################
# Generate CA Private Key. Will Require a password
openssl genrsa -aes256 -out ca-key.pem 4096

# Optional. Decode The Private Key
openssl rsa -in ca-key.pem -out ca.key

# Optional. Generate CA Public Key
openssl rsa -in ca.key -pubout -out ca.pub

# Generate CA Certificate
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

#########################
# Server
#########################
# Generate Server Private Key
openssl genrsa -out server-key.pem 4096
# Generate Server Certificate
openssl req -subj "/CN=$HOST/O=$COMPANY_NAME" -sha256 -new -key server-key.pem -out server.csr
# CA Issue the Certificate
openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem

#########################
# Client
#########################
# Generate Client Private Key
openssl genrsa -out client-key.pem 1024
# Generate Client Certificate
openssl req -subj "/CN=client" -sha256 -new -key client-key.pem -out client.csr\
-reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS:example.com,DNS:www.example.com\nextendedKeyUsage=clientAuth"))
# CA Issue the Certificate
openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem