class CreateDocuments < ActiveRecord::Migration[7.0]
  def change
    create_table :documents do |t|
      t.string :title
      t.text :content
      t.integer :tokens

      t.timestamps
    end
  end
end
