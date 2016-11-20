variable "do_token" {}
variable "domain_name" {
  default = "furikuri.net"
}
variable "ssh_fingerprint" {}

provider "digitalocean" {
  token = "${var.do_token}"
}

resource "digitalocean_droplet" "coreos" {
  name = "cake-server"
  size = "512mb"
  image = "coreos-stable"
  region = "fra1"
  private_networking = true
  ssh_keys = ["${var.ssh_fingerprint}"]
  user_data = "${file("cloud-config.yml")}"
}

resource "digitalocean_record" "coreos" {
  domain = "${var.domain_name}"
  type = "A"
  name = "cake"
  value = "${digitalocean_droplet.coreos.ipv4_address}"
}

output "fqdn" {
  value = "${digitalocean_record.coreos.fqdn}"
}