sudo yum -y update

sudo amazon-linux-extras enable postgresql14
sudo yum install -y postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo chmod 755 /home/ec2-user
sudo -u postgres psql -c "ALTER USER postgres with PASSWORD 'password';"

curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo npm install pm2@latest -g
cd ~/webapp
sudo pm2 start index.js
sudo pm2 startup systemd
sudo pm2 save

echo "Hello, world"