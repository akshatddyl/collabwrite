export const API_BASE_URL = '/api';
export const WS_BASE_URL = `ws://${window.location.hostname}:8080/ws/editor`;

export const CURSOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F1948A', '#82E0AA', '#F8C471', '#AED6F1', '#D7BDE2',
];

export const JAVA_TEMPLATE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CollabWrite!");
    }
}
`;

export const FILE_ICONS = {
  java: '☕',
  default: '📄',
};
