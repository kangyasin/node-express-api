const Contact = require('../models/Contact');
const authService = require('../services/auth.service');

const ContactController = () => {
  const store = async (req, res) => {
    const { body } = req;
    try {
      const contact = await Contact.create({
        name: body.name,
        content: body.content,
        type: body.type,
      });
      const token = authService().issue({ id: contact.id });

      return res.status(200).json({ token, contact });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getAll = async (req, res) => {
    try {
      const contacts = await Contact.findAll();

      return res.status(200).json({ contacts });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const update = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const destroy = (req, res) => {
    Contact.delete(req.id);
    return res.status(200).json();
  };

  return {
    store,
    getAll,
    update,
    destroy,
  };
};

module.exports = ContactController;
