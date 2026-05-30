use axum::{routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
}

#[derive(Serialize)]
struct HelloResponse {
    message: &'static str,
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok" })
}

pub(crate) async fn hello() -> Json<HelloResponse> {
    Json(HelloResponse {
        message: "Hello from the Rust backend",
    })
}

pub fn app() -> Router {
    Router::new()
        .route("/api/health", get(health))
        .route("/api/hello", get(hello))
}

#[tokio::main]
async fn main() {
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app()).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum_test::TestServer;

    #[tokio::test]
    async fn test_hello_handler() {
        let server = TestServer::new(app()).unwrap();
        let response = server.get("/api/hello").await;
        response.assert_status_ok();
        response.assert_json(&serde_json::json!({"message": "Hello from the Rust backend"}));
    }

    #[tokio::test]
    async fn test_health_handler() {
        let server = TestServer::new(app()).unwrap();
        let response = server.get("/api/health").await;
        response.assert_status_ok();
        response.assert_json(&serde_json::json!({"status": "ok"}));
    }
}
