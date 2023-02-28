sudo yum -y update

# installing postgresql
# sudo amazon-linux-extras install epel
# sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
# [pgdg13]
# name=PostgreSQL 13 for RHEL/CentOS 7 - x86_64
# baseurl=http://download.postgresql.org/pub/repos/yum/13/redhat/rhel-7-x86_64
# enabled=1
# gpgcheck=0
# EOF

sudo amazon-linux-extras install postgresql10
sudo chmod 755 /home/ec2-user

# sudo yum install postgresql13 postgresql13-server -y
# sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
# sudo systemctl enable --now postgresql-13
# systemctl status postgresql-13
# sudo chmod 755 /home/ec2-user
# sudo -u postgres psql -c "ALTER USER postgres with PASSWORD 'password';"
#install node and pm2
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo npm install pm2@latest -g
cd ~/webapp
sudo pm2 startup systemd --service-name webapp
sudo pm2 start index.js
sudo pm2 save

echo "Hello, world"