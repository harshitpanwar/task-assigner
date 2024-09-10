import { Schema, model, models } from 'mongoose';

const taskSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['text', 'audio', 'video', 'image'], required: true },
  media_uri: { type: [String], required: false },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  annotater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answer_type: { type: String, enum: ['radio_button', 'text_field', 'checkbox_single', 'checkbox_multiple'], required: true },
  answer: { type: [String], required: false },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'reassigned'], default: 'pending' }
});

export const Task = models.Task || model('Task', taskSchema);
