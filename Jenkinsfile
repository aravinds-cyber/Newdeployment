pipeline {
  agent any

  environment {
    REGISTRY = 'yourdockerhubuser/sample-app'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/youruser/yourrepo.git'
      }
    }

    stage('Build & Push Image') {
      steps {
        script {
          def tag = "${env.BUILD_NUMBER}"
          sh "docker build -t $REGISTRY:$tag ."
          docker.withRegistry('', 'dockerhub-creds') {
            sh "docker push $REGISTRY:$tag"
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withKubeConfig([credentialsId: 'kubeconfig']) {
          sh """
            sed 's|IMAGE_TAG|${env.BUILD_NUMBER}|g' k8s/deployment.yaml > k8s/deploy-gen.yaml
            kubectl apply -f k8s/deploy-gen.yaml
          """
        }
      }
    }
  }
}

