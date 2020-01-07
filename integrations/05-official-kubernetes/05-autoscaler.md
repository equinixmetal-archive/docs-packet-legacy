<!-- <meta>
{
    "title":"Autoscaler",
    "slug":"autoscaler",
    "description":"Using K8s Autoscaler on Packet",
    "author":"Mo Lawler",
    "github":"usrdev",
    "date": "2019/12/18",
    "tag":["Devops", "Integrations"]
}
</meta> -->

With the cluster autoscaler for Packet, worker nodes perform autoscaling within any specified nodepool. It will run as a Deployment in your cluster. The nodepool is specified using tags on Packet.

Note: It’s recommended to pair the autoscaler with the Packet CCM (Cloud Controller Manager) for Kubernetes as that takes care of the logical node objects being removed from the cluster. 

Learn more about the project here, or check out our Technical Guide “Kubernetes Cluster Autoscaler on Packet.” for leveraging Autoscaler on Packet. 
