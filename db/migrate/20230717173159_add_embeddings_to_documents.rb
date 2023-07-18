class AddEmbeddingsToDocuments < ActiveRecord::Migration[7.0]
  def change
    add_column :documents, :embeddings, :vector, limit: 1536
  end
end
