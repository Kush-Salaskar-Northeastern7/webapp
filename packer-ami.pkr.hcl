packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

// define variables
variable "source_ami" {
  type    = string
  default = ""
}

variable "ami_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_name" {
  type    = string
  default = "CSYE6223_SPRING2023_{{timestamp}}"
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "AWS_ACCESS_KEY_ID" {
  type    = string
  default = ""
}

variable "AWS_SECRET_ACCESS_KEY" {
  type    = string
  default = ""
}

// source - amazon-ebs, shared with demo account
source "amazon-ebs" "my-ami" {
  access_key    = "${var.AWS_ACCESS_KEY_ID}"
  secret_key    = "${var.AWS_SECRET_ACCESS_KEY}"
  region        = "${var.ami_region}"
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  ami_name      = "${var.ami_name}"
  ami_description = "AMI - Spring 2023"
  ami_users = [562694632201]
//   aws_polling {
//     delay_seconds = 120
//     max_attempts  = 50
//   }

//   launch_block_device_mappings {
//     delete_on_termination = true
//     device_name           = "/dev/sda1"
//     volume_size           = 50
//     volume_type           = "gp2"
//   }
}

// build with all the provisioners
build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source = "webapp.zip"
    destination = "~/"
  }
  provisioner "shell" {
    inline = [
      "cd ~",
      "sudo mkdir -v -m755 webapp",
      "sudo unzip webapp.zip -d webapp"
    ]
  }
  provisioner "shell" {
    scripts = [
      "./buildscript.sh",
    ]
  }
}