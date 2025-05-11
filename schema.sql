CREATE TABLE IF NOT EXISTS inventory (id INT AUTO_INCREMENT PRIMARY KEY,
                                                            name VARCHAR(255) NOT NULL,
                                                                              quantity INT NOT NULL,
                                                                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
