import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { KubeDeployment, KubeService } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, ns: string, appLabel: string) {
    super(scope, ns);

    // define resources here
    // Define a Kubernetes Deployment
    new KubeDeployment(this, 'my-deployment', {
      spec: {
        replicas: 3,
        selector: { matchLabels: { app: appLabel } },
        template: {
          metadata: { labels: { app: appLabel } },
          spec: {
            containers: [
              {
                name: 'app-container',
                image: 'ghcr.io/dbrookesspc/k8s-hello-world:5283e7ef0b94475dee168b7ce9c2ffa6f814b4226ca16e610660b7be2233136a',
                ports: [{ containerPort: 80 }]
              }
            ],
            imagePullSecrets: [{ name: 'ghcr-secret' }]
          }
        }
      }
    });
    new KubeService(this, 'loadbalancer', {
      spec: {
        selector: { app: appLabel },
        ports: [{ port: 80, targetPort: { value: 80 } }],
        type: 'LoadBalancer' // or 'NodePort' for local testing
      }
    });
  }
}

const app = new App();
new MyChart(app, 'k8s-hello-world', 'helloworld');
app.synth();
